package server.model;

public enum TaskStatus {
    TODO,
    PENDING,   // alias / frontend compat - treat same as TODO
    IN_PROGRESS,
    COMPLETED
}
