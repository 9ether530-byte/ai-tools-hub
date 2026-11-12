import ContactForm from '../../components/ContactForm';

export const metadata = { title: 'Contact — NativeLayer AI Tools Hub' };

export default function ContactPage() {
  return (
    <>
      <h1>Contact</h1>
      <p>
        Questions about a guide, a correction, or a topic you would like us to cover?
        Send a message — it is stored locally and we reply by email.
      </p>
      <p>Email: <a href="mailto:rocdaddy850@gmail.com">rocdaddy850@gmail.com</a></p>
      <ContactForm />
    </>
  );
}
