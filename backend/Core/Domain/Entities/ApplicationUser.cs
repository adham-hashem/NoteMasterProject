using Microsoft.AspNetCore.Identity;
using Core.Domain.Entities;

namespace Core.Domain.Entities
{
	public class ApplicationUser : IdentityUser<Guid>
	{
		public string? PersonName { get; set; }
		public string? Gender { get; set; }
		public string? Address { get; set; }
		public string? PostalCode { get; set; }
		public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
		public ICollection<Note> Notes { get; set; } = new List<Note>();
	}
}
