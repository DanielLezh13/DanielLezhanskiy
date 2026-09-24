import { ImageResponse } from "next/og";

export const alt = "Daniel Lezhanskiy — Explore My Ideas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        padding: "70px 78px",
        background: "#14130f",
        color: "#f5f2eb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -155,
          right: -130,
          width: 690,
          height: 690,
          display: "flex",
          border: "1px solid #625a3d",
          borderRadius: "50%",
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 95,
          right: 85,
          width: 350,
          height: 350,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #b5a267",
          borderRadius: "50%",
          background: "#1d1b15",
          boxShadow: "0 30px 90px #080806",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#d9c27b",
            fontSize: 95,
            fontWeight: 700,
            letterSpacing: -9,
          }}
        >
          DL
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 62,
          right: 395,
          width: 105,
          height: 105,
          display: "flex",
          border: "1px solid #776d4d",
          borderRadius: "50%",
          background: "#1b1913",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 65,
          right: 85,
          width: 112,
          height: 112,
          display: "flex",
          border: "1px solid #776d4d",
          borderRadius: "50%",
          background: "#1b1913",
        }}
      />
      <div
        style={{
          width: 760,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#d5bf7c",
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ad9b62",
              borderRadius: "50%",
              fontSize: 21,
              letterSpacing: 0,
            }}
          >
            D
          </div>
          DANIEL LEZHANSKIY
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 95,
            fontSize: 86,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -4,
          }}
        >
          Explore My Ideas
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            color: "#c4beb0",
            fontSize: 28,
          }}
        >
          Philosophy · Religion · Politics · Economics
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            color: "#cbb779",
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          daniellezhanskiy.com
        </div>
      </div>
    </div>,
    size,
  );
}
