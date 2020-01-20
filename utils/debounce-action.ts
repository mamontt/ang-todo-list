/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
type DebounceActionArgumentType<A, R> = (args: A) => Promise<R> | R;
type DebounceActionReturnType<A, R> = (args: A) => Promise<R> | void;

export function debounceAction<A, R>(action: DebounceActionArgumentType<A, R>): DebounceActionReturnType<A, R> {
    let running = false;
    return (args: A) => {
        if (running) return undefined;

        running = true;
        return Promise.resolve(action(args))
            .then((result) => {
                running = false;
                return result;
            });
    };
}
