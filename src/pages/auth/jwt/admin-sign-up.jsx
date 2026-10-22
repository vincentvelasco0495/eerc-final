import { CONFIG } from 'src/global-config';

import { JwtAdminSignUpView } from 'src/auth/view/jwt';

const metadata = { title: `Register admin - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <JwtAdminSignUpView />
    </>
  );
}
