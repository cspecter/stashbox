import '../styles/styles.css'

// Configure Amplify
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';

// in this way you are only importing Auth and configuring it.
Amplify.configure({ ...aws_exports, ssr: true });

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}