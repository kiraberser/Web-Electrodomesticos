
const Button = ({
  children,
  ...props
}: {
  children: string | React.ReactNode;
  [key: string]: any;
}) => {
  return (
    <button {...props}>
      {children}
    </button>
  );
};
export default Button;