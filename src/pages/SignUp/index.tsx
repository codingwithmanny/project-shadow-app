// Imports
// ========================================================
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../providers/Supabase';
import { useMutation } from "react-query";
// import { useAppAuth } from "../../providers/AppAuth";

// Queries
import { AUTH } from "../../queries";

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
const SignUpPage = () => {
  // State / Props
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, user, error, reset } = useAuth();

  // Requests
  /**
   * 
   */
  const { data: authUser, error: authError, mutate: authSignUp } = useMutation(AUTH.SIGNIN)

  /**
   * If authentication sign up is complete
   * Sign up user with API
   */
  useEffect(() => {
    if (!user) return;

    authSignUp({ id: user.id, email: user.email });

    return () => {
      reset();
    }
  }, [user]);

  // Functions
  /**
   * 
   * @param event 
   */
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    signUp(input);
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
        <Heading as="h1" >{!authUser || authError ? 'Sign Up' : 'Please check your email'}</Heading>
        {(!isSubmitting && !authUser || authError) ? <Text className="text-right">Already have an account?<br /><Link className="text-slate-700 font-medium hover:underline" to="/signin">Sign in</Link>.</Text> : null}
      </div>
      {authUser && !authError
        ? <Text>Please confirm your email address and <Link className="text-slate-700 font-medium hover:underline" to="/signin">sign in</Link>.</Text>
        : <form onSubmit={onSubmitForm}>
          <div className="mb-6">
            <Label htmlFor="email" className="mb-2">Email address</Label>
            <Input disabled={isSubmitting && !authError} required className="w-full" onChange={onChangeInput('email')} type="email" name="email" id="email" placeholder="your@email.com"></Input>
          </div>
          <div className="mb-8">
            <Label htmlFor="password" className="mb-2">Password</Label>
            <Input disabled={isSubmitting && !authError} required className="w-full" onChange={onChangeInput('password')} type="password" name="password" id="password" placeholder="••••••••"></Input>
          </div>
          {error?.message || authError
            ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{`${authError || error?.message || 'Unknown error.'}`}</div>
            : null
          }
          <div className="">
          </div>
          <div className="flex items-center justify-end">
            <Button disabled={isSubmitting && !authError} className="flex justify-center items-center" type="submit">
              {isSubmitting && !authError ? <Loader className="h-6 stroke-slate-100" /> : 'Sign Up'}
            </Button>
          </div>
        </form>}
    </div>
  </AuthLayout>;
};

// Exports
// ========================================================
export default SignUpPage;