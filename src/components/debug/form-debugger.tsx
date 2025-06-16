import { useFormContext } from "react-hook-form";

export function FormDebugger() {
    const { watch, formState } = useFormContext();
    const values = watch();

    return (
        <pre className="bg-gray-100 text-sm pt-4 mt-4 overflow-auto">
            <strong>Form Values:</strong> {JSON.stringify(values, null, 2)}{"\n"}
            <strong>Errors:</strong> {JSON.stringify(formState.errors, null, 2)}{"\n"}
        </pre>
    );
}