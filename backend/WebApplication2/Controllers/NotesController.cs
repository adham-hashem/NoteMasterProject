using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Core.Domain.Entities;
using Core.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.DB;

namespace NoteMasterAPI.Controllers
{
    [Route("api/subjects")]
    [ApiController]
    public class NotesController  : ControllerBase
    {
        private readonly NotesDbContext _context;

        public NotesController(NotesDbContext context)
        {
            _context = context;
        }

        // Helper method to get the User ID from claims
        private Guid GetUserIdFromClaims()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);  // Get the "sub" claim
            return Guid.Parse(userId);  // Convert the claim to Guid
        }

        // Getting all the notes of the user
/*        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
        {
            var userId = GetUserIdFromClaims();

            var notes = await _context.Notes
                .Where(n => n.UserId == userId)
                .ToListAsync();

            if (notes == null || !notes.Any())
            {
                return NotFound();
            }

            return Ok(notes);
        }*/





    }
}
