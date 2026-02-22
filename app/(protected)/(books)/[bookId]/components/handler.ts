import {
  ContentUpdateForm,
  isAnswerSheetContent,
  isExternalContent,
  validateAnswerSheetContent,
  validateExternalContent,
} from "@/models";

const addContent = async (content: ContentUpdateForm) => {
  if (!isExternalContent(content)) {
    throw new Error("Invalid content type");
  }
  validateExternalContent(content);

  await fetch("/api/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
};

const addAnswerSheet = async (content: ContentUpdateForm) => {
  if (!isAnswerSheetContent(content)) {
    throw new Error("Invalid answer sheet content");
  }
  validateAnswerSheetContent(content);

  await fetch("/api/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
};

export const handleContentForm = async (result: ContentUpdateForm) => {
  if (result) {
    switch (result.type) {
      case "content":
        await addContent(result as ContentUpdateForm);
        break;
      case "answer_sheet":
        await addAnswerSheet(result as ContentUpdateForm);
        break;
      default:
        throw new Error(`Unsupported content type: ${result.type}`);
    }
  }
};
