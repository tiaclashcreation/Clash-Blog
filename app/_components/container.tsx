type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="w-full max-w-6xl mx-auto px-8 sm:px-12 md:px-20">{children}</div>;
};

export default Container; 