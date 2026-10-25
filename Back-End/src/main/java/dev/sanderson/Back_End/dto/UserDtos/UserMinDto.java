package dev.sanderson.Back_End.dto.UserDtos;

import dev.sanderson.Back_End.entity.User;
import lombok.*;

@Getter
@Setter
public class UserMinDto {
    private String name;
    private String email;

    public static UserMinDto from(User user) {
        UserMinDto dto = new UserMinDto();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
