import { SignupForm } from '@/components/auth/SignupForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'Sign up — ChordCraft' };

export default function SignupPage() {
  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
