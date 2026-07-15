import { useAppDispatch } from '@app/store/hooks';
import { removeMedia } from '@entities/media';

interface RemoveMediaButtonProps {
  id: string;
  name: string;
}

export function RemoveMediaButton({
  id,
  name,
}: RemoveMediaButtonProps) {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      aria-label={`Remove ${name}`}
      onClick={() => dispatch(removeMedia(id))}
    >
      ×
    </button>
  );
}