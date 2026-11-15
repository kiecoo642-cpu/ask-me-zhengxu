import { buildAnswerCitations } from "@/lib/answer-citations";
import { buildAnswerPlan, demoAnswer } from "@/lib/answer";
import { decideAnswerability } from "@/lib/answerability";
import type { ConversationMessage } from "@/lib/conversation-history";
import { assessQuestion } from "@/lib/guardrails";
import {
  getClaims,
  getSources,
  matchStableAnswer,
  retrieveKnowledge,
  serializeKnowledgeItems,
} from "@/lib/knowledge";
import { buildLocalQuestionFrame, findQuestionContract } from "@/lib/question-contracts";
import { getFollowUpQuestions } from "@/lib/question-suggestions";
import type {
  AnswerCitation,
  AnswerDisposition,
  ChatMessage,
  ResponseStatus,
} from "@/lib/types";

export interface LocalMockChatResult {
  answer: string;
  mode: "demo" | "guardrail" | "stable" | "boundary";
  responseStatus: ResponseStatus;
  disposition: AnswerDisposition;
  deliveryMode: "local_reveal";
  modelPath: "local_fallback";
  degraded: false;
  claimIds: string[];
  sourceIds: string[];
  citations: AnswerCitation[];
  sources: ReturnType<typeof getSources>;
  items: ReturnType<typeof serializeKnowledgeItems>;
  followUpQuestions: string[];
}

export function buildLocalMockChatResult(input: {
  question: string;
  history: ChatMessage[];
}): LocalMockChatResult {
  const cleanQuestion = input.question.trim();
  const askedQuestions = input.history
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .concat(cleanQuestion);
  const guardrail = assessQuestion(cleanQuestion);

  if (!guardrail.allowed) {
    return {
      answer: guardrail.reason,
      mode: "guardrail",
      responseStatus: "refused",
      disposition: "decline",
      deliveryMode: "local_reveal",
      modelPath: "local_fallback",
      degraded: false,
      claimIds: [],
      sourceIds: [],
      citations: [],
      sources: [],
      items: [],
      followUpQuestions: getFollowUpQuestions(cleanQuestion, askedQuestions),
    };
  }

  const contract = findQuestionContract(cleanQuestion);
  const frame = buildLocalQuestionFrame(cleanQuestion, input.history);
  const items = retrieveKnowledge(cleanQuestion, { history: input.history, limit: 4, frame });
  const stableAnswer = matchStableAnswer(cleanQuestion, input.history, frame);
  const claimIds = stableAnswer
    ? [...stableAnswer.requiredClaimIds]
    : [...new Set(items.flatMap((item) => item.claimIds))];
  const sourceIds = stableAnswer
    ? [...stableAnswer.requiredSourceIds]
    : [...new Set(items.flatMap((item) => item.sourceIds))];
  const plan = buildAnswerPlan(cleanQuestion, items, stableAnswer, input.history, frame, contract);
  const followUpQuestions = plan.followUpQuestions.length
    ? plan.followUpQuestions
    : getFollowUpQuestions(cleanQuestion, askedQuestions);
  const decision = decideAnswerability({
    question: cleanQuestion,
    history: input.history,
    frame,
    plan,
    items,
    claimIds,
    sourceIds,
    stableAnswer,
    contract,
  });

  if (decision.disposition === "decline" || decision.disposition === "clarify") {
    const answer = decision.message ?? demoAnswer(cleanQuestion, items, stableAnswer, input.history);
    return {
      answer,
      mode: "boundary",
      responseStatus: decision.disposition === "decline" ? "refused" : "completed",
      disposition: decision.disposition,
      deliveryMode: "local_reveal",
      modelPath: "local_fallback",
      degraded: false,
      claimIds: [],
      sourceIds: [],
      citations: [],
      sources: [],
      items: [],
      followUpQuestions,
    };
  }

  const answer = demoAnswer(cleanQuestion, items, stableAnswer, input.history);
  const claims = getClaims(claimIds);
  const sources = getSources(sourceIds);
  const citations = buildAnswerCitations(answer, claims);

  return {
    answer,
    mode: stableAnswer ? "stable" : "demo",
    responseStatus: "completed",
    disposition: decision.disposition,
    deliveryMode: "local_reveal",
    modelPath: "local_fallback",
    degraded: false,
    claimIds,
    sourceIds,
    citations,
    sources,
    items: serializeKnowledgeItems(items),
    followUpQuestions,
  };
}

export function toConversationMetadata(result: LocalMockChatResult): Partial<ConversationMessage> {
  return {
    mode: result.mode,
    responseStatus: result.responseStatus,
    disposition: result.disposition,
    deliveryMode: result.deliveryMode,
    modelPath: result.modelPath,
    degraded: result.degraded,
    claimIds: result.claimIds,
    sourceIds: result.sourceIds,
    citations: result.citations,
    sources: result.sources,
    items: result.items,
    followUpQuestions: result.followUpQuestions,
  };
}
