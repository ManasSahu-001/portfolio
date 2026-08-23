import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Manas Sahu — Building Software. Exploring Intelligence.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#16150f",
          color: "#faf9f6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            color: "#9c968b",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          MANAS SAHU · NIT ROURKELA
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          Building software.
        </div>
        <div style={{ fontSize: 84, fontStyle: "italic", color: "#7c93f5" }}>
          Exploring intelligence.
        </div>
        <div style={{ fontSize: 30, color: "#d8d4c8", marginTop: 40 }}>
          Full Stack • GenAI • Agentic AI • DSA
        </div>
      </div>
    ),
    size
  );
}
