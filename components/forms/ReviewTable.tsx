"use client";

interface ReviewTableProps {
  fields: Array<{
    label: string;
    value: string;
    key: string;
  }>;
}

export function ReviewTable({ fields }: ReviewTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="divide-y divide-gray-200 bg-white">
          {fields.map((field, index) => (
            <tr key={field.key} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">
                {field.label}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {field.value || (
                  <span className="italic text-gray-400">Not provided</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}