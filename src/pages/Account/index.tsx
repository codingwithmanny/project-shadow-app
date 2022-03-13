// Imports
// ========================================================
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../providers/Supabase';
import { useMutation } from 'react-query'
import { User, Lock } from 'react-feather';
import { USERS } from '../../queries';
import { useAppAuth } from "../../providers/AppAuth";

// Presentation components
import DashboardLayout from "../../layouts/Dashboard";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Text from "../../components/Text";

// Main page
// ========================================================
const AccountPage = () => {
  // State / Props
  const isMounted = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState({
    username: '',
    email: ''
  });
  const { getUser } = useAppAuth();
  const { session, reset } = useAuth();

  // Requests
  /**
   * CREATE
   */
  const { isLoading: isRetrieving, data: userReadData, error: userReadError, mutate: userRead } = useMutation(USERS.READ);

  /**
   * UPDATE
   */
  const { isLoading: isUpdating, data: userUpdateData, error: userUpdateError, mutate: userUpdate } = useMutation(USERS.UPDATE);

  // Functions
  /**
   * 
   */
  const onClickReset = () => {
    if (!isMounted.current) return;
    setIsSubmitting(true);
    reset();
    setIsSubmitting(false);
  };

  /**
   * 
   * @param field 
   * @returns 
   */
  const onChangeInput = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMounted.current) return;
    setInput({
      ...input,
      [field]: event.target.value,
    });
  };

  /**
   * 
   * @param event 
   */
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    userUpdate({ token: session?.access_token, id: userReadData.id, payload: input });
  };

  // Hooks
  /**
   * 
   */
  useEffect(() => {
    isMounted.current = true;
    userRead({ token: session?.access_token, id: 'me ' });

    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * 
   */
  useEffect(() => {
    if (!isMounted.current || !userReadData || userReadError) return;
    setInput(userReadData);
  }, [userReadData]);

  useEffect(() => {
    if (!isMounted.current || !userUpdateData || userUpdateError) return;
    getUser();
  }, userUpdateData)

  // Render
  return <DashboardLayout>
    <div>
      <div className="p-8">
        <header className="pb-10 block">
          <Heading as="h1" className="mb-2">Account Settings</Heading>
          <Text>Change your profile and account settings</Text>
        </header>
        <section>
          <div className="rounded-lg bg-white border border-slate-200 flex flex-wrap">
            <div className="block w-full md:w-2/6 xl:w-1/5 border-b md:border-r md:border-b-0 border-slate-200">
              <ul>
                <li>
                  <Text>
                    <Link className="h-16 hover:bg-slate-100 transition-all ease-out duration-200 flex items-center leading-10 px-6 font-medium" to="/dashboard/account">
                      <User className="text-slate-800 mr-2" />
                      Account
                    </Link>
                  </Text>
                </li>
                <li>
                  <Text>
                    <Link className="h-16 hover:bg-slate-100 transition-all ease-out duration-200 flex items-center leading-10 px-6 font-medium" to="/dashboard/account">
                      <Lock className="text-slate-800 mr-2" />
                      Security
                      <small className='ml-2 text-xs text-slate-400'>(Coming soon)</small>
                    </Link>
                  </Text>
                </li>
              </ul>
            </div>
            <div className="block w-full md:w-4/6 xl:w-4/5 py-10 px-8 md:px-10">
              <Heading as="h4" className="mb-4">General Info</Heading>
              {isRetrieving
                ? <Loader className="stroke-slate-400" />
                :
                <form onSubmit={onSubmitForm}>
                  <div className="mb-6">
                    <Label htmlFor="username" className="mb-2">Username</Label>
                    <Input disabled={isUpdating} onChange={onChangeInput('username')} value={`${input?.username}`} className="w-full" name="username" id="username" placeholder="Ex: johnwick" />
                  </div>
                  <div className="mb-8">
                    <Label htmlFor="email" className="mb-2">Email</Label>
                    <Input disabled={isUpdating} onChange={onChangeInput('email')} value={`${input?.email}`} className="w-full" type="email" name="email" id="email" placeholder="your@email.com" />
                  </div>
                  {userUpdateError
                    ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{(userUpdateError as any)?.message ?? 'Unknown error.'}</div>
                    : null
                  }
                  <div className="flex flex-col md:flex-row">
                    {!isSubmitting ? <Button onClick={onClickReset} variant="grayNoWidth" disabled={isSubmitting} className="flex justify-center items-center mb-4 md:mr-4 md:mb-0" type="button">
                      {isUpdating ? <Loader className="h-6 stroke-slate-600" /> : 'Reset Password'}
                    </Button> : null}
                    <Button disabled={isUpdating} className="flex justify-center items-center" type="submit">
                      {isUpdating ? <Loader className="h-6 stroke-white" /> : 'Update'}
                    </Button>
                  </div>
                </form>
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  </DashboardLayout>
};

// Exports
// ========================================================
export default AccountPage;