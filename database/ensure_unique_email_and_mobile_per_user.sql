-- The combination of this stored procedure and triggers will ensure we only
-- have one active user per email address or mobile number but an unlimited
-- number of inactive users with those same details.
DELIMITER $$
drop procedure if exists ensure_unique_user;
create procedure ensure_unique_user (
    IN v_user_id int,
    IN v_user_mobile varchar(128),
    IN v_email varchar(128)
)
BEGIN
    declare existing_with_email int;
    declare existing_with_mobile int;

    -- We only need to run these checks on active users or users being made active
    if v_email is not null then
        select count(user_id)
        into @existing_with_email
        from users u
        where
            u.user_id != v_user_id
            and u.email = v_email
            and u.is_active = 1;

        if @existing_with_email != 0 then
            signal sqlstate '45000' set message_text = 'Error: An active user with this email address already exists!';
        end if;
    end if;

    if v_user_mobile is not null then
        select count(user_id)
        into @existing_with_mobile
        from users u
        where
            u.user_id != v_user_id
            and u.user_mobile = v_user_mobile
            and u.is_active = 1;

        if @existing_with_mobile != 0 then
            signal sqlstate '45000' set message_text = 'Error: An active user with this mobile number already exists!';
        end if;
    end if;
END$$
DELIMITER ;

DELIMITER $$
drop trigger if exists ensure_users_uniqueness_on_insert;
create trigger ensure_users_uniqueness_on_insert
before insert on users
for each row
begin
    if NEW.is_active = 1 then
        call ensure_unique_user(NEW.user_id, NEW.user_mobile, NEW.email);
    end if;
end$$
DELIMITER ;

DELIMITER $$
drop trigger if exists ensure_users_uniqueness_on_update;
create trigger ensure_users_uniqueness_on_update
before update on users
for each row
begin
    if NEW.is_active = 1 then
        call ensure_unique_user(NEW.user_id, NEW.user_mobile, NEW.email);
    end if;
end$$
DELIMITER ;
