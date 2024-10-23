using System;
using System.Collections.Generic;
using Core.Domain.Entities;

namespace Core.Domain.Entities;

public partial class Note
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid SubjectId { get; set; }

    public string NoteContent { get; set; } = null!;

    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ApplicationUser ApplicationUser { get; set; } = null!;

    public virtual Subject Subject { get; set; } = null!;
}
