namespace Core.DTO.NoteDtos
{
    public class CreateNoteDto
    {
        public string NoteContent { get; set; } = null!;
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
