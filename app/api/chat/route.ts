import { handleChatRequest } from "@/backend/chat";

export const runtime = "nodejs";
export const POST = handleChatRequest;
