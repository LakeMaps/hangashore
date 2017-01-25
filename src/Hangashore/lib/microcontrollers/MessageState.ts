export class MessageStateStarted {}
export class MessageStateCommand {}
export class MessageStatePayload {}
export class MessageStateChecksum {}

export type MessageState = MessageStateStarted
    | MessageStateCommand
    | MessageStatePayload
    | MessageStateChecksum
;
