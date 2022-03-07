// Imports
// ========================================================
// Presentation components
import Text from "../../components/Label";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import AuthLayout from "../../layouts/Auth";
import { useNavigate } from "react-router-dom";

// Main Page
// ========================================================
const NotFoundPage = () => {
  // State / Props
  const navigate = useNavigate();

  // Functions
  const onClickGoBackHome = () => {
    navigate('/');
  };

  // Render
  return <AuthLayout>
    <div className="max-w-md bg-white w-full pt-10 pb-12 px-8 m-4 lg:p-10 border border-gray-300 shadow-md rounded-md">
      <div className="mb-6 flex justify-center items-center">
        <Heading as="h1">Not Found</Heading>
      </div>
      <div className="flex justify-center">
        <div className="flex justify-center flex-col items-center">
          <Text className="text-center mb-8">Looks like you found nowhere.</Text>
          <Button onClick={onClickGoBackHome}>Go Back Home</Button>
        </div>
      </div>
    </div>
  </AuthLayout>;
};

// Exports
// ========================================================
export default NotFoundPage;