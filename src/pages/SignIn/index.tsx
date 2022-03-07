// Imports
// ========================================================
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../providers/Supabase';
import { useAppAuth } from "../../providers/AppAuth";

// Presentation components
import Input from "../../components/Input";
import Label from "../../components/Label";
import Text from "../../components/Label";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import AuthLayout from "../../layouts/Auth";
import Loader from "../../components/Loader";
import { useMutation } from "react-query";
import { AUTH } from "../../queries";

// Main Page
// ========================================================
const SignInPage = () => {
  // State / Props
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, session, error } = useAuth();

  // Requests
  // const [isLoadingForm, setIsLoadingForm] = useState(false);
  // const { isLoading: isLoadingAuth, signIn, session, error } = useAuth();
  // const { getProfile } = useAppAuth();
  // const isFormDisabled = isLoadingForm;

  // // Hooks
  // /**
  //  * 
  //  */
  // useEffect(() => {
  //   if (!session || error || isLoadingAuth) return;

  //   getProfile();
  // }, [session]);


  // Functions
  /**
   * 
   * @param event 
   */
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    signIn(input);
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
        <Heading as="h1" >Sign In</Heading>
        {!isSubmitting ? <Text className="text-right">Don't have an account?<br /><Link className="text-slate-700 font-medium hover:underline" to="/signup">Create an account</Link>.</Text> : null}
      </div>
      <form onSubmit={onSubmitForm}>
        <div className="mb-6">
          <Label htmlFor="email" className="mb-2">Email address</Label>
          <Input disabled={isSubmitting} required className="w-full" onChange={onChangeInput('email')} type="email" name="email" id="email" placeholder="your@email.com"></Input>
        </div>
        <div className="mb-8">
          <Label htmlFor="password" className="mb-2">Password</Label>
          <Input disabled={isSubmitting} required className="w-full" onChange={onChangeInput('password')} type="password" name="password" id="password" placeholder="••••••••"></Input>
        </div>
        {error
          ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{error?.message ?? 'Unknown error.'}</div>
          : null
        }
        <div className="">
        </div>
        <div className="flex items-center justify-between">
          <Text><Link className="text-slate-700 font-medium hover:underline" to="/signup">Forgot password?</Link></Text>
          <Button disabled={isSubmitting} className="flex justify-center items-center" type="submit">
            {isSubmitting ? <Loader className="h-6 stroke-slate-100" /> : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>
  </AuthLayout>;
};

// Exports
// ========================================================
export default SignInPage;