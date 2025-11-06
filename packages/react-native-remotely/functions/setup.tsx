import { getGlobalInstance } from "../helpers/global-instance";

export type SetupProps = {
    shared: Record<string, unknown>;
};

export function setup(props: SetupProps) {
    Object.entries(props.shared).forEach(([key, value]) => {
        getGlobalInstance()[key] = value;
    });
}
