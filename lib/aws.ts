// Configure Amplify
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';

// in this way you are only importing Auth and configuring it.
Amplify.configure({ ...aws_exports, ssr: true });

function createAWSAPi () {

    return Object.freeze({
        signUp,
        signIn,
        current
    });

    async function signUp({email, password}) {
        try {
            const { user } = await Auth.signUp({
                username: email,
                password
            });
            return user;
        } catch (error) {
            console.log('error signing up:', error);
        }
    }

    async function signIn({email, password}) {
        try {
            const user = await Auth.signIn(email, password);
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    async function current() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            return user;
        } catch (error) {
            console.log('error checking for user', error);
            return false
        }
    }

}

export const AWS = createAWSAPi();