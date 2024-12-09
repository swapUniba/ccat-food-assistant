use food_assistant;

create table chat_users
(
    chat_user_id int auto_increment primary key,
    created_at   timestamp default current_timestamp() not null
);

create table chat_rooms
(
    room_id    int(11) auto_increment primary key,
    user_id1   int(11)                                 not null,
    user_id2   int(11)                                 not null,
    created_at timestamp   default current_timestamp() not null,
    type       varchar(15) default 'chat'              null,
    foreign key (user_id1) references chat_users (chat_user_id)
        on update cascade on delete cascade,
    foreign key (user_id2) references chat_users (chat_user_id)
        on update cascade on delete cascade
);

create table chat_messages
(
    message_id int auto_increment primary key,
    room_id      int(11)                                 not null,
    sender_id    int(11)                                 not null,
    type         varchar(25) default 'text'              null,
    content      blob                                    not null,
    is_read      int(1)      default 0                   null,
    otp          varchar(10)                             null,
    created_at   timestamp   default current_timestamp() not null,
    metadata     text                                    null,
    foreign key (room_id) references chat_rooms (room_id)
        on update cascade on delete cascade,
    foreign key (sender_id) references chat_users (chat_user_id)
        on update cascade on delete cascade
);



create table users
(
    user_id    int(11)      not null primary key auto_increment,
    username   varchar(25)  not null,
    password   varchar(255) not null,
    created_at timestamp default current_timestamp
);

alter table users
    add first_name varchar(25),
    add last_name  varchar(25);
alter table users
    add chat_user_id int(11) default null;
alter table users
    add foreign key (chat_user_id) references chat_users (chat_user_id);


insert into chat_users (chat_user_id, created_at) VALUES (1, NOW());


create table shortlinks
(
    link_id      int auto_increment
        primary key,
    original_url text                                   not null,
    created_at   timestamp    default CURRENT_TIMESTAMP not null,
    updated_at   timestamp    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    owner_id     int                                    null,
    name         varchar(128) default ''                not null
);

create index owner_id
    on shortlinks (owner_id);
