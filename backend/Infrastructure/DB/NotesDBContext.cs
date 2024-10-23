using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Core.Domain.Entities;

namespace Infrastructure.DB;

public partial class NotesDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public NotesDbContext()
    {
    }

    public NotesDbContext(DbContextOptions<NotesDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Note> Notes { get; set; }
    public virtual DbSet<Subject> Subjects { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // to enable creating the tables of Identity

        // Subject
        modelBuilder.Entity<Subject>(Entity =>
        {
            Entity.HasKey(s => s.Id);

            Entity.HasOne(s => s.ApplicationUser)
                .WithMany(u => u.Subjects)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            Entity.HasMany(s => s.Notes)
                .WithOne(n => n.Subject)
                .HasForeignKey(n => n.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);
        });


        // Note
        modelBuilder.Entity<Note>(entity =>
        {
            entity.HasKey(n => n.Id);

            entity.HasOne(n => n.Subject)
                .WithMany(s => s.Notes)
                .HasForeignKey(n => n.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(n => n.ApplicationUser)
                .WithMany(u => u.Notes)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ApplicationUser
        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.HasMany(u => u.Subjects)
                .WithOne(s => s.ApplicationUser)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(u => u.Notes)
                .WithOne(n => n.ApplicationUser)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
