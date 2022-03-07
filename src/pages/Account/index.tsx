// Imports
// ========================================================
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, useTable } from '../../providers/Supabase';
import { useAppAuth } from "../../providers/AppAuth";
import { User, Lock } from 'react-feather';

// Presentation components
import DashboardLayout from "../../layouts/Dashboard";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
// import { useAuthLoader } from "../../providers/AuthLoaderProvider";

// Main page
// ========================================================
const AccountPage = () => {
  // State / Props
  const isMounted = useRef(false);
  const { user } = useAuth();
  const [input, setInput] = useState({
    username: '',
    email: '',
  });
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const [error, setError] = useState<any>();
  // const { profile } = useAppAuth();
  const [data, setData] = useState<any>();
  // const { pathname } = useLocation();
  // const { isLoading, signUp, signIn, user, signOut } = useAuth();
  const { client } = useTable();
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const isFormDisabled = isLoadingForm || isSubmitting || isSendingReset;

  // Functions
  /**
 * 
 */
  const query = useCallback(async () => {
    setIsRetrieving(true);

    const { data, error } = await client
      .from('profiles')
      .select(`*`).eq('id', `${user?.id}`)

    if (isMounted.current) {
      if (error) {
        setError(error);
        setIsRetrieving(false);
        return;
      }

      // TODO remove
      setData(data);
      setInput({
        email: data?.[0]?.email ?? '',
        username: data?.[0]?.username ?? ''
      })
      setIsRetrieving(false);
    }
  }, []);

  /**
   * 
   */
  const update = useCallback(async ({ username, email }: { username?: string, email?: string }) => {
    setIsSubmitting(true);

    const update: { [key: string]: string } = {};

    if (username) {
      update.username = username;
    }

    if (email) {
      update.email = email;
    }

    const { data, error } = await client
      .from('profiles')
      .update(update).match({ id: `${user?.id}` })

    if (isMounted.current) {
      if (error) {
        setError(error);
        setIsRetrieving(false);
        return;
      }

      // TODO remove
      setData(data);
      setInput({
        email: data?.[0]?.email ?? '',
        username: data?.[0]?.username ?? ''
      });
      setIsSubmitting(false);
    }
  }, []);

  /**
   * 
   */
  const reset = useCallback(async () => {
    setIsSendingReset(true);

    const { data, error } = await client
      .auth.api
      .resetPasswordForEmail(`${user?.email}`)

    if (isMounted.current) {
      if (error) {
        setError(error);
        setIsSendingReset(false);
        return;
      }

      setIsSendingReset(false);
    }
  }, [])

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

  /**
   * 
   * @param event 
   */
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update(input);
  }

  /**
   * 
   */
  const onClickReset = () => {
    reset();
  }

  // Hooks
  useEffect(() => {
    isMounted.current = true;
    query();
    return () => {
      isMounted.current = false;
    }
  }, []);

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
            <div className="block w-full md:w-1/5 border-b md:border-r md:border-b-0 border-slate-200">
              <ul>
                <li className="mt-4">
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
                    </Link>
                  </Text>
                </li>
              </ul>
            </div>
            <div className="block w-full md:w-4/5 py-10 px-8 md:px-10">
              <Heading as="h4" className="mb-4">General Info</Heading>
              {isRetrieving ?
                <Loader className="stroke-slate-400" />
                :
                <form onSubmit={onSubmitForm}>
                  <div className="mb-6">
                    <Label htmlFor="username" className="mb-2">Username</Label>
                    <Input disabled={isFormDisabled} onChange={onChangeInput('username')} value={`${input?.username}`} className="w-full" name="username" id="username" placeholder="Ex: johnwick" />
                  </div>
                  <div className="mb-8">
                    <Label htmlFor="email" className="mb-2">Email</Label>
                    <Input disabled={isFormDisabled} onChange={onChangeInput('email')} value={`${input?.email}`} className="w-full" type="email" name="email" id="email" placeholder="your@email.com" />
                  </div>
                  {error
                    ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{error?.message ?? 'Unknown error.'}</div>
                    : null
                  }
                  <div className="flex justify-end">
                    {!isSubmitting ? <Button onClick={onClickReset} variant="gray" disabled={isFormDisabled} className="flex justify-center items-center mr-4" type="submit">
                      {isFormDisabled ? <Loader className="h-6 stroke-slate-600" /> : 'Reset Password'}
                    </Button> : null}

                    <Button disabled={isFormDisabled} className="flex justify-center items-center" type="submit">
                      {isFormDisabled ? <Loader className="h-6 stroke-white" /> : 'Update'}
                    </Button>
                  </div>
                </form>}
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