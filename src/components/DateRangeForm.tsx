import { useEffect, useState } from "react";
import Button, { ButtonStyle } from "./Button";

interface Props {
  initialStartDate?: string;
  initialEndDate?: string;
  onSubmit: (startDate: Date, endDate: Date) => void;
  onCancel: () => void;
}

export default function RecordsForm({
  initialStartDate = "",
  initialEndDate = "",
  onSubmit,
  onCancel,
}: Props) {
  const [startInput, setStartInput] = useState(initialStartDate);
  const [endInput, setEndInput] = useState(initialEndDate);

  useEffect(() => {
    setStartInput(initialStartDate);
    setEndInput(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!startInput || !endInput) {
      alert("Please select both dates.");
      return;
    }

    const startDate = new Date(`${startInput}T00:00:00`);
    const endDate = new Date(`${endInput}T23:59:59.999`);

    if (startDate > endDate) {
      alert("The start date must be before the end date.");
      return;
    }

    onSubmit(startDate, endDate);
  }

  return (
    <form
      className="hobbyForm"
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="hobbyForm__row">
        <label htmlFor="startDate">Start date:</label>

        <input
          id="startDate"
          type="date"
          value={startInput}
          onChange={(event) => setStartInput(event.currentTarget.value)}
        />
      </div>

      <div className="hobbyForm__row">
        <label htmlFor="endDate">End date:</label>

        <input
          id="endDate"
          type="date"
          value={endInput}
          onChange={(event) => setEndInput(event.currentTarget.value)}
        />
      </div>

      <div className="hobbyForm__actions">
        <Button
          buttonType="submit"
          style={ButtonStyle.Primary}
          onClick={() => {}}
          title="Get records"
        />

        <Button
          style={ButtonStyle.Second}
          onClick={onCancel}
          title="Cancel"
        />
      </div>
    </form>
  );
}
