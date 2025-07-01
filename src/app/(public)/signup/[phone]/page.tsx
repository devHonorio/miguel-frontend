import { Form } from "./form";
interface LoginProps {
  params: Promise<{ phone: string }>;
}
export default async function Login({ params }: LoginProps) {
  const { phone } = await params;
  return <Form phone={phone} />;
}
