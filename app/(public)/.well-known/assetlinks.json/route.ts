import { NextResponse } from "next/server";

export const GET = () => {
  const env = process.env.NODE_ENV ?? "development";

  const assetLinks = {
    development: [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.merahputihperkasa.prodigi",
          sha256_cert_fingerprints: [
            "19:C9:12:B2:2A:1C:72:A8:12:37:96:7D:F1:CB:98:C8:11:41:2B:4A:FB:96:13:29:74:A2:C0:DC:12:43:54:A4",
          ],
        },
      },
    ],
    production: [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.merahputihperkasa.prodigi",
          sha256_cert_fingerprints: [
            "19:C9:12:B2:2A:1C:72:A8:12:37:96:7D:F1:CB:98:C8:11:41:2B:4A:FB:96:13:29:74:A2:C0:DC:12:43:54:A4",
          ],
        },
      },
    ],
  };

  return NextResponse.json(assetLinks[env]);
};
