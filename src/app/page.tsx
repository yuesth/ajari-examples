'use client'
import { ChatApp, ChatProvider, LoginModal } from "@ajariapps/chat-react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface ISessionUser {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  name: string;
  email: string;
  foto: string;
  avatar: string;
  otp_verified: boolean;
  is_register_face: boolean;
  live_translate: string;
  phone: string;
}

export interface ISession {
  exp: number;
  users: ISessionUser;
}

export default function Home() {
  const [localToken, setLocalToken] = useState<string>("");
  const [localUserId, setLocalUserId] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const onCheckToken = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      const userId = localStorage.getItem("current_user_id");
      if (accessToken) {
        const decoded: ISession = jwtDecode(accessToken as string);
        if (decoded.exp < new Date().getTime() / 1000) {
          localStorage.removeItem("token");
          window.location.reload();
          return;
        }
        setLocalToken(accessToken as string);
        setLocalUserId(userId as string);
      } else {
        setShowLoginModal(true);
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const onSuccessLogin = async (
    token?: string,
    current_user_id?: string,
    current_username?: string
  ) => {
    localStorage.setItem("token", token as string);
    localStorage.setItem("current_user_id", current_user_id as string);
    localStorage.setItem("current_username", current_username as string);
    await onCheckToken();
  };

  useEffect(() => {
    onCheckToken();
  }, []);
  return (
    <ChatProvider defaultToken={localToken} defaultUserId={localUserId}>
    <main className="flex min-h-screen flex-col items-center justify-between p-24 font-poppins">
      {localToken ? (
        <ChatApp authorized={true} />
      ) : (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={(token, current_user_id, current_username) => {
            onSuccessLogin(token, current_user_id, current_username);
          }}
        />
      )}
    </main>
  </ChatProvider>
  );
}
