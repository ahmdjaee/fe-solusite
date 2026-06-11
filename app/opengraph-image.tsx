import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "./lib/seo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 48%, #dbeafe 100%)",
          color: "#0f172a",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 72,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 24,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "#2563eb",
                borderRadius: 28,
                color: "#ffffff",
                display: "flex",
                fontSize: 42,
                fontWeight: 800,
                height: 88,
                justifyContent: "center",
                width: 88,
              }}
            >
              S
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ color: "#2563eb", fontSize: 28, fontWeight: 700 }}>
                {siteName}
              </div>
              <div style={{ color: "#475569", fontSize: 24 }}>
                Website, aplikasi web, dan produk digital
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.04,
              maxWidth: 980,
            }}
          >
            Solusi digital yang siap tumbuh bersama bisnis Anda
          </div>
          <div style={{ color: "#475569", fontSize: 30, lineHeight: 1.4, maxWidth: 940 }}>
            {siteDescription}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
