using System;
using System.Collections.Generic;
using Core.Domain.Entities;

namespace Core.Domain.Entities;

public partial class Subject
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ApplicationUser ApplicationUser { get; set; } = null!;

    public virtual ICollection<Note> Notes { get; set; } = new List<Note>();

}
