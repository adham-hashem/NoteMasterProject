using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Core.DTO;
using Core.Domain.Entities;
using Infrastructure.DB;
using Core.DTO.NoteDtos;
using Core.DTO.SubjectDtos;

namespace NoteMasterAPI.Controllers
{
    [ApiController]
    [Route("api/subjects")]
    public class SubjectsController : ControllerBase
    {
        private readonly NotesDbContext _context;

        public SubjectsController(NotesDbContext context)
        {
            _context = context;
        }

        // Helper method to get the User ID from the claims
        private Guid GetUserIdFromClaims()
        {
            return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));  // This gets the "sub" claim or any other claim containing the user ID
        }

        // GET: /api/subjects
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            // Get the authenticated user's ID
            var userId = GetUserIdFromClaims();

            // Fetch subjects that belong to the user
            var subjects = await _context.Subjects
                .Where(s => s.UserId == userId)  // Assuming Subject has a UserId field
                .ToListAsync();

            if (!subjects.Any())
            {
                return NoContent();
            }

            return Ok(subjects);
        }

        // GET: api/subjects/5
        [Authorize]
        [HttpGet("{subjectId:guid}")]
        public async Task<IActionResult> GetSubject(Guid subjectId)
        {
            var userId = GetUserIdFromClaims();

            var subject = await _context.Subjects.
                FirstOrDefaultAsync(s => s.Id == subjectId);

            if (subject == null)
            {
                return NotFound();
            }

            return Ok(subject);
        } 

        // Getting the notes of the user of a certain subject
        // GET: api/subjects/5/notes
        [Authorize]
        [HttpGet("{subjectId:guid}/notes")]
        public async Task<ActionResult<IEnumerable<Note>>> GetNotesOfSubject(Guid subjectId)
        {
            var userId = GetUserIdFromClaims();

            var notes = await _context.Notes
                .Where(n => n.SubjectId == subjectId && n.UserId == userId)
                .ToListAsync();

            if (notes == null || !notes.Any())
            {
                return NotFound();
            }

            return Ok(notes);
        }

        // Getting a note of a certain subject of the user
        // GET: api/subjects/5/notes/5
        [Authorize]
        [HttpGet("{subjectId:guid}/notes/{noteId:guid}")]
        public async Task<ActionResult<Note>> GetNote(Guid subjectId, Guid noteId)
        {
            var userId = GetUserIdFromClaims();

            var note = await _context.Notes
                .FirstOrDefaultAsync(n => n.SubjectId == subjectId && n.Id == noteId && n.UserId == userId);

            if (note == null)
            {
                return NotFound();
            }

            return Ok(note);
        }



        // GET: /api/subjects/5/Users



        // PUT: /api/subjects/5
        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> PutSubject(Guid id, EditSubjectDTO editSubjectDTO)
        {
            if (editSubjectDTO == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Get the authenticated user's ID
            var userId = GetUserIdFromClaims();

            var subject = new Subject
            {
                Id = id,
                UserId = userId,
                Name = editSubjectDTO.Name
            };

            _context.Subjects.Update(subject);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Putting a note of a certain subject
        // PUT: api/subject/5/notes/5
        [Authorize]
        [HttpPut("{subjectId:guid}/notes/{noteId:guid}")]
        public async Task<IActionResult> PutNote(Guid subjectId, Guid noteId, EditNoteDto editNoteDTO)
        {
            var userId = GetUserIdFromClaims();

            var note = await _context.Notes.
                FirstOrDefaultAsync(n => n.SubjectId == subjectId && n.Id == noteId && n.UserId == userId);

            if (note == null)
            {
                return NotFound();
            }

            note.NoteContent = editNoteDTO.NoteContent;

            _context.Entry(note).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoteExists(noteId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: /api/subjects
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostSubject(CreateSubjectDto createSubjectDto)
        {
            // Get the authenticated user's ID
            var userId = GetUserIdFromClaims();

            if (createSubjectDto == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subject = new Subject
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = createSubjectDto.Name
            };

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubject), new { subjectId = subject.Id }, subject);
        }

        // POST: api/subjects/5/notes
        [Authorize]
        [HttpPost("{subjectId:guid}/notes")]
        public async Task<IActionResult> PostNote(Guid subjectId, CreateNoteDto createNoteDto)
        {
            if (createNoteDto == null)
            {
                return BadRequest("Note cannot be null!");
            }

            var userId = GetUserIdFromClaims();

            var note = new Note
            {
                UserId = userId,
                SubjectId = subjectId,
                NoteContent = createNoteDto.NoteContent,
                CreatedAt = createNoteDto.CreatedAt
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNote), new { subjectId = note.SubjectId, noteId = note.Id }, note);
        }

        // DELETE: /api/subjects/5
        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteSubject(Guid id)
        {
            // Get the authenticated user's ID
            var userId = GetUserIdFromClaims();

            // Fetch the subject that belongs to the user
            var subject = await _context.Subjects
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (subject == null)
            {
                return NotFound();
            }

            _context.Remove(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/subjects/5/notes/5
        [Authorize]
        [HttpDelete("{subjectId:guid}/notes/{noteId:guid}")]
        public async Task<IActionResult> DeleteNote(Guid subjectId, Guid noteId)
        {
            var userId = GetUserIdFromClaims();

            var note = await _context.Notes
                .FirstOrDefaultAsync(n => n.SubjectId == subjectId && n.Id == noteId && n.UserId == userId);

            if (note == null)
            {
                return NotFound();
            }

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubjectExists(Guid id)
        {
            return _context.Subjects.Any(s => s.Id == id);
        }
        private bool NoteExists(Guid id)
        {
            return _context.Notes.Any(e => e.Id == id);
        }
    }
}
