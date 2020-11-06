// Configure Amplify
import Amplify, { withSSRContext } from 'aws-amplify';
import aws_exports from '../aws-exports';
import { SignUpI } from '../interfaces'

// in this way you are only importing Auth and configuring it.
Amplify.configure({ ...aws_exports, ssr: true });

import {bucket} from './api'

function createAWSAPi() {
    const { Auth } = withSSRContext();

    let AWSUser;
    let CosmicUser;
    let UserName;

    current().then(c=>console.log(c)).catch(e=>console.error(e));

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
        signOut,
        isSignedIn
    });

    function signUp({ email, password, username }: SignUpI) {
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
            //console.log(AWSUser, CosmicUser);
            return CosmicUser
        } catch (error) {
            throw new Error(error)
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

    async function isSignedIn() {
        if (CosmicUser) {
            return CosmicUser
        } else {
            try {
                return await current()
            } catch (error) {
                throw new Error(error)
            }
        }
    }

    // Cosmic methods

    async function addUserToCosmic(uid:string, email:string, username:string) {
        const params = {
          title: uid,
          type_slug: 'users',
          content: '',
          metafields: [
            {
              title: 'Username',
              key: 'username',
              type: 'text',
              value: username
            },
            {
              title: "Email",
              key: 'email',
              type: 'text',
              value: email
            }
          ],
          options: {
            slug_field: uid
          }
        };
      
        try {
          const data = bucket.addObject(params);
          return data
        } catch (error) {
          throw new Error(error);
        }
      
      }
      
    async function getUser(uid) {
        try {
          const user = await bucket.getObject({
            slug: uid,
            //props: 'slug,title,username,zip_code,email, birthday, is_over_21' // get only what you need
          });
      
          return user
        } catch (error) {
          throw new Error(error)
        }
      }
      
      async function updateUser({uid, birthday, isOver21}) {
        try {
          const params = {
            slug: uid,
            metafields: []
          };
      
          if (birthday) params.metafields.push({
            title: 'birthday',
            key: 'birthday',
            type: 'number',
            value: birthday
          });
          
          if (isOver21) params.metafields.push({
            title: 'Is Over 21',
            key: 'is_over_21',
            type: 'switch',
            value: isOver21,
            options: "true,false"
          });
      
          const user = await bucket.editObjectMetafields(params);
      
          return user
      
        } catch (error) {
          throw new Error(error);
        }
      }

}

export const AWS = createAWSAPi();