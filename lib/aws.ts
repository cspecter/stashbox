// Configure Amplify
import Amplify, { withSSRContext } from 'aws-amplify';
import aws_exports from '../aws-exports';

// in this way you are only importing Auth and configuring it.
Amplify.configure({ ...aws_exports, ssr: true });

import { addUserToCosmic, getUser, updateUser } from './api';

function createAWSAPi() {
    const { Auth } = withSSRContext();

    let AWSUser;
    let CosmicUser;
    let UserName;

    current();

    return Object.freeze({
        signUp,
        signIn,
        current,
        verifyEmail,
        sendVerification,
        checkIfCosmicUser,
        cosmicUser,
        getAWSUser,
        updateUserAge,
        signInAfterSignUp,
        signOut
    });

    function signUp({ email, password, username }) {
        return new Promise(async (resolve, reject) => {
            try {
                const { user } = await Auth.signUp({
                    username: email,
                    password
                });
                UserName = username;
                resolve(user);
            } catch (error) {
                reject(error)
            }
        });
    }

    async function signIn({ email, password }) {
        try {
            const user = await Auth.signIn(email, password);
            AWSUser = user;
            await getCosmicUser();
        } catch (error) {
            throw new Error(error);
        }
    }

    async function signOut() {
        try {
            await Auth.signOut();
        } catch(error) {
            throw new Error(error)
        }
        
    }

    async function signInAfterSignUp({ email, password }) {
        try {
            const user = await Auth.signIn(email, password);
            AWSUser = user;
            await registerCosmicUser();
        } catch (error) {
            throw new Error(error);
        }
    }

    async function current() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            AWSUser = user;
            await getCosmicUser();
            console.log(AWSUser, CosmicUser);
            return user
        } catch (error) {
            console.log('error checking for user', error);
            return false
        }
    }

    async function verifyEmail(email: string, code: string) {
        try {
            const verified = Auth.confirmSignUp(email, code);
            return verified
        } catch (error) {
            throw new Error(error);
        }
    }

    async function sendVerification(email: string) {
        try {
            const verified = Auth.resendSignUp(email);
            return verified
        } catch (error) {
            throw new Error(error);
        }
    }

    async function getCosmicUser() {
        try {
            const cosmicUser = await getUser(AWSUser.username);
            CosmicUser = cosmicUser;
        } catch (e) {
            throw new Error(e)
        }
    }

    function checkIfCosmicUser() {
        return new Promise(async (resolve, reject) => {
            try {
                await getCosmicUser();
                resolve(true);
            } catch (e) {
                registerCosmicUser();
                reject(e)
            }
        })
    }

    async function registerCosmicUser() {
        try {
            const newCosmicUser = await addUserToCosmic(AWSUser.username, AWSUser.attributes.email, UserName);
            CosmicUser = newCosmicUser;
            console.log(newCosmicUser);
        } catch(error) {
            throw new Error(error)
        }
    }

    async function updateUserAge({birthday, isOver21}) {
        try {
            const cUser = updateUser({uid: AWSUser.username, birthday, isOver21})
            CosmicUser = cUser;
            console.log("Updated User Age", cUser, birthday, isOver21)
        } catch(error) {
            throw new Error(error)
        }
    }

    function cosmicUser() {
        return CosmicUser
    }

    function getAWSUser() {
        return AWSUser
    }

}

export const AWS = createAWSAPi();