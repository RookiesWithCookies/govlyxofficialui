import GovlyxLogo from "../ui/GovlyxLogo";

type Props = {
  title: string;
  subtitle: string;
};

const AuthHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="mb-6 text-center">
      {/* Logo */}
      <GovlyxLogo className="mb-3 justify-center" size={74} />

      {/* Title */}
      <h1 className="text-lg font-semibold">{title}</h1>

      {/* Subtitle */}
      <p className="mt-1 text-sm opacity-70">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
