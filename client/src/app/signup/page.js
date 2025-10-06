import { TextField, Label, Input, Text, Button, Heading } from "react-aria-components";

export default function SignUpPage() {
  return (
    <main>
      <section aria-labelledby="signin-title">
        <Heading id="signin-title" level={1}>Sign in</Heading>

        <form /* no onSubmit yet */>
          <TextField>
            <Label>Username</Label>
            <Input type="username" name="username" autoComplete="username" />
            <Text slot="description">Use your name or create a custom username.</Text>
          </TextField>

          <TextField>
            <Label>Email</Label>
            <Input type="email" name="email" autoComplete="email" />
            <Text slot="description">Use your school or personal email.</Text>
          </TextField>

          <TextField>
            <Label>Password</Label>
            <Input type="password" name="password" autoComplete="current-password" />
            <Text slot="description">Password must be at least 8 characters.</Text>
          </TextField>

          <Button type="submit">Sign in</Button>
        </form>
      </section>

    </main>
  );
}