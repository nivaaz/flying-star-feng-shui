import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const INPUT_PATH = path.join(process.cwd(), 'data', 'cities5000.txt');
const ZIP_PATH = path.join(process.cwd(), 'data', 'cities5000.zip');
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'cities.generated.json');

async function downloadFile(url, dest) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  await fs.promises.writeFile(dest, Buffer.from(buffer));
}

async function buildCities() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.log('cities5000.txt not found. Attempting to download...');
    try {
      await fs.promises.mkdir(path.dirname(INPUT_PATH), { recursive: true });
      await downloadFile('https://download.geonames.org/export/dump/cities5000.zip', ZIP_PATH);
      console.log('Downloaded cities5000.zip. Extracting...');
      
      // Using a simple child_process to unzip if available, or just suggest manual extraction
      // Alternatively, we can use a library, but let's try to keep it simple with what's likely available.
      const { execSync } = await import('node:child_process');
      execSync(`unzip -o ${ZIP_PATH} -d ${path.dirname(INPUT_PATH)}`);
      console.log('Extracted cities5000.txt');
    } catch (err) {
      console.error('Failed to download or extract cities data:', err);
      process.exitCode = 1;
      return;
    }
  }

  const fileStream = fs.createReadStream(INPUT_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  /** @type {Array<{id:string,name:string,country:string,admin1?:string,lat:number,lon:number,timeZone:string,population:number}>} */
  const cities = [];

  for await (const line of rl) {
    if (!line || line.startsWith('#')) continue;

    const parts = line.split('\t');
    // Expect GeoNames cities format with at least 19 columns
    if (parts.length < 19) continue;

    const [
      geonameid, // 0
      name, // 1
      asciiname, // 2
      _alternatenames, // 3
      latStr, // 4
      lonStr, // 5
      _featureClass, // 6
      _featureCode, // 7
      countryCode, // 8
      _cc2, // 9
      admin1Code, // 10
      _admin2Code, // 11
      _admin3Code, // 12
      _admin4Code, // 13
      populationStr, // 14
      _elevation, // 15
      _dem, // 16
      timezone, // 17
      _modificationDate, // 18
    ] = parts;

    const lat = Number.parseFloat(latStr);
    const lon = Number.parseFloat(lonStr);
    const population = Number.parseInt(populationStr, 10) || 0;

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (!timezone) continue;

    const record = {
      id: String(geonameid),
      name: (asciiname && asciiname.trim()) || (name && name.trim()) || String(geonameid),
      country: countryCode,
      lat,
      lon,
      timeZone: timezone,
      population,
    };

    if (admin1Code && admin1Code.trim()) {
      record.admin1 = admin1Code.trim();
    }

    cities.push(record);
  }

  cities.sort((a, b) => b.population - a.population);

  await fs.promises.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  const json = JSON.stringify(cities);
  await fs.promises.writeFile(OUTPUT_PATH, json, 'utf8');

  console.log(`Wrote ${cities.length} cities to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

buildCities().catch((err) => {
  console.error('Error while building cities dataset:', err);
  process.exitCode = 1;
});
