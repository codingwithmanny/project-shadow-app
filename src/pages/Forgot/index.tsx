// Imports
// ========================================================
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../providers/Supabase';

// Presentation components
import Input from "../../components/Input";
import Label from "../../components/Label";
import Text from "../../components/Label";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import AuthLayout from "../../layouts/Auth";
import Loader from "../../components/Loader";

// Main Page
// ========================================================
const ForgotPage = () => {
  // State / Props
  const [input, setInput] = useState({
    email: '',
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword, error } = useAuth();

  // Functions
  /**
   * 
   * @param event 
   */
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    setHasSubmitted(false);
    setIsSubmitting(true);
    resetPassword(input);

    setTimeout(() => {
      setHasSubmitted(true);
      setIsSubmitting(false);
      setInput({
        email: ''
      });
    }, 300);
    event.preventDefault();
  };

  /**
   * 
   * @param field 
   * @returns 
   */
  const onChangeInput = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [field]: event.target.value
    });
  };

  // Render
  return <AuthLayout>
    <div className="max-w-md bg-white w-full pt-10 pb-12 px-8 m-4 lg:p-10 border border-gray-300 shadow-md rounded-md">
      <div className="mb-6 flex justify-between items-center">
        <Heading as="h1" >Forgot?</Heading>
        {!isSubmitting ? <Text className="text-right w-1/2">Go back to <Link className="text-slate-700 font-medium hover:underline" to="/signin">Sign In</Link>.</Text> : null}
      </div>
      <form onSubmit={onSubmitForm}>
        <div className="mb-6">
          <Label htmlFor="email" className="mb-2">Email address</Label>
          <Input disabled={isSubmitting} required className="w-full" onChange={onChangeInput('email')} type="email" name="email" id="email" placeholder="your@email.com"></Input>
        </div>
        {hasSubmitted ? <div className="mb-6">
          <Text>If there is an account, please check your email.</Text>
        </div> : null}
        {error
          ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{error?.message ?? 'Unknown error.'}</div>
          : null
        }
        <div className="">
        </div>
        <div className="flex items-center justify-between">
          <Button disabled={isSubmitting} className="flex justify-center items-center" type="submit">
            {isSubmitting ? <Loader className="h-6 stroke-slate-100" /> : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  </AuthLayout>;
};

// Exports
// ========================================================
export default ForgotPage;