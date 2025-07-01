import { Form } from "./form";
interface LoginProps {
  params: Promise<{ phone: string; name: string }>;
}
export default async function VerifyCode({ params }: LoginProps) {
  const { phone, name } = await params;
  return <Form phone={phone} name={name} />;
}
