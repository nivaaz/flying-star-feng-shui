import { getDrainingElement, getNourishingElement, reccomendElements } from "./utils";
import { Star } from "./types";
import { elementNumberMap } from "./charts";

describe("reccomendElements", () => {
    // const stars: Star[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const stars: Star[] = [1, 2];

    stars.forEach((homeStar) => {
        stars.forEach((currentYearStar) => {
            const elHome = elementNumberMap[homeStar];
            const nourishHome = getNourishingElement(elHome.element);
            const drainHome = getDrainingElement(elHome.element);

            const elCurrentYear = elementNumberMap[currentYearStar];
            const nourishCurrentYear = getNourishingElement(elCurrentYear.element);
            const drainCurrentYear = getDrainingElement(elCurrentYear.element);

            it(`should handle home star ${homeStar} and current year star ${currentYearStar} 
                \n ${homeStar} ${elHome.auspicious} ${elHome.element} ${nourishHome} drain ${drainHome}
                \n ${currentYearStar} ${elCurrentYear.auspicious} ${elCurrentYear.element} ${nourishCurrentYear} ${drainCurrentYear}`, () => {

                const result = reccomendElements(
                    { element: elHome.element, auspicious: elHome.auspicious },
                    nourishHome,
                    drainHome,
                    { element: elCurrentYear.element, auspicious: elCurrentYear.auspicious },
                    nourishCurrentYear,
                    drainCurrentYear
                );
                console.log(result)
                // if (elHome.auspicious) {
                //     expect(result).toContain(`Add ${elHome.element}`);
                //     expect(result).toContain(`Add ${nourishHome}`);
                //     expect(result).toContain(`Remove ${drainHome}`);
                // } else {
                //     expect(result).toContain(`Remove ${elHome.element}`);
                //     expect(result).toContain(`Remove ${nourishHome}`);
                //     expect(result).toContain(`Add ${drainHome}`);
                // }

                // test for exceptions only:
                if (elHome.auspicious && !elCurrentYear.auspicious) {
                    if (elHome.element === elCurrentYear.element) {
                        expect(result).toContain(`worst`);
                        expect(result).toContain(`Remove ${elHome.element}`);
                    }
                    if (nourishCurrentYear === nourishHome) {
                        expect(result).toContain(`Remove ${nourishHome}`);
                    }
                    if (drainCurrentYear === drainHome) {
                        expect(result).toContain(`Remove ${drainHome}`);
                    }
                } else if (!elHome.auspicious && !elCurrentYear.auspicious) {
                    expect(result).toContain(`remove ${elCurrentYear.element}`);
                    expect(result).toContain(`remove ${nourishCurrentYear}`);
                    expect(result).toContain(`add ${drainCurrentYear}`);
                }
                if (!elHome.auspicious && elCurrentYear.auspicious) {
                    expect(result).toContain(`This is a mixed area of your home.`);
                }

                expect(result).toBeDefined(); // Ensure the function returns a result
                expect(typeof result).toBe("string"); // Ensure the result is a string
            });
        });
    });
});

// describe("reccomendElements", () => {
//     const stars: Star[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//     if (elHome.auspicious && elCurrentYear.auspicious) {
//         expect(result).toContain(`This is one of the best places of your home this year.`);
//     }
//     else if (!elHome.auspicious && !elCurrentYear.auspicious) {
//         expect(result).toContain(`One of the worst places of your home this year.`);
//     }
//     else if (!elHome.auspicious && elCurrentYear.auspicious || elHome.auspicious && !elCurrentYear.auspicious) {
//         expect(result).toContain(`This is a mixed area of your home.`);
//     }
// });

/**
 *
What are the combinations you can get:
2. is it auspicious or not
 a. auspicious auspicious
 b. auspicious inauspicious
 c. inauspicious auspicious
 d. inauspicious inauspicious

all the elements:
water
fire
earth
wood
metal

1. element,
2. draning
3. enhancing element

9 x9 stars



 *
 *
 *
 */
