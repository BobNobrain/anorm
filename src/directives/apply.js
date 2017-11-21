export const apply = (directives, to) => {
    for (let i = 0; i < directives; i++) {
        directives[i](to);
    }
};
