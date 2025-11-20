import * as React from "react";

interface CreateEmailTemplateProps {
  firstName: string;
  roomCode: string;
  roomPass: string;
}

export function CreateEmailTemplate({
  firstName,
  roomCode,
  roomPass,
}: CreateEmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "600px",
      }}
    >
      <h1 style={{ color: "#333" }}>Welcome, {firstName}!</h1>
      <p>Your Secret Santa room has been successfully created! 🎄</p>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          margin: "20px 0",
        }}
      >
        <h2 style={{ color: "#d32f2f", marginTop: 0 }}>Room Details:</h2>
        <p>
          <strong>Room Code:</strong> {roomCode}
        </p>
        <p>
          <strong>Room Password:</strong> {roomPass}
        </p>
      </div>
      <p>
        Share the room code and password with participants so they can join!
      </p>
      <p style={{ color: "#666", fontSize: "14px", marginTop: "30px" }}>
        Happy Holidays! 🎅
      </p>
    </div>
  );
}
