export type Role = "user" | "assistant";

export interface BaseMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  description: string;
  type: "article" | "video" | "course" | "paper" | "tool";
}

export interface Strategy {
  title: string;
  description: string;
  duration?: string;
}

export interface AssistantMetadata {
  subject: string;
  confidence: number;
  summary: string;
  strategies: Strategy[];
  resources: ResourceLink[];
  followUps: string[];
  sentiment: "supportive" | "motivational" | "directive";
}

export interface UserMetadata {
  subjectHint?: string;
}

export interface AssistantMessage extends BaseMessage {
  role: "assistant";
  metadata: AssistantMetadata;
}

export interface UserMessage extends BaseMessage {
  role: "user";
  metadata?: UserMetadata;
}

export type Message = UserMessage | AssistantMessage;

export interface AgentRequestBody {
  messages: Message[];
}

export interface AgentResponse {
  message: AssistantMessage;
}
