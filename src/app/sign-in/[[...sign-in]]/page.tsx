import Center from "@/components/layout/Center";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <Center>
      <SignIn />
    </Center>
  );
}
