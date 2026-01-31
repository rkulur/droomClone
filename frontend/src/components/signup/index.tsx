import DroomAdvantages from "./DroomAdvantages";
import SignInForm from "./SignInForm";

const Signup = () => {
  return (
    <div className="signup object-cover h-[45rem] w-full px-horizontal py-16 flex gap-16">
      <DroomAdvantages />
      <SignInForm />
    </div>
  );
};

export default Signup;
