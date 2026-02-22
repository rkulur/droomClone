import DroomAdvantages from "./DroomAdvantages";
import SignInForm from "./SignInForm";

const Signup = () => {
  return (
    <div className="signup object-cover h-[50rem] w-full px-horizontal py-16 flex gap-16 relative">
      <DroomAdvantages />
      <SignInForm />
    </div>
  );
};

export default Signup;
