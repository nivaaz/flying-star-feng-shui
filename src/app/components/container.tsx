import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = (props: ContainerProps) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 dark:text-slate-100 text-slate-900 p-4 md:p-8 rounded-xl w-full">
      {props.children}
    </div>
  );
};

export default Container;

