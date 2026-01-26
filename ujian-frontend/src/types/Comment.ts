export interface Comment {
    id: number;
    proposalId: number;
    sectionId: string;
    userId: number;
    message: string;
    isResolved: boolean;
    createdAt: string;
    user: {
        id: number;
        name: string;
        role?: string;
    };
}

export interface CreateCommentPayload {
    proposalId: number;
    sectionId: string;
    message: string;
    userId?: number;
}
